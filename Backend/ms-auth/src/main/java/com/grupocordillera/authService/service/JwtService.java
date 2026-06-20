package com.grupocordillera.authservice.service;

import com.grupocordillera.authservice.model.User;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.text.ParseException;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

    private static final String ISSUER = "grupo-cordillera-auth-service";
    private static final long TOKEN_TTL_SECONDS = 3600;

    private final PrivateKey privateKey;
    private final PublicKey publicKey;
    private final String publicKeyPem;

    public JwtService(
            @Value("classpath:keys/private.pem") Resource privateKeyResource,
            @Value("classpath:keys/public.pem") Resource publicKeyResource
    ) throws Exception {
        String privateKeyPem = readResource(privateKeyResource);
        this.publicKeyPem = readResource(publicKeyResource);
        this.privateKey = parsePrivateKey(privateKeyPem);
        this.publicKey = parsePublicKey(publicKeyPem);
    }

    public String generateToken(User user) {
        try {
            Instant now = Instant.now();
            JWTClaimsSet claims = new JWTClaimsSet.Builder()
                    .issuer(ISSUER)
                    .subject(user.getUsername())
                    .claim("username", user.getUsername())
                    .claim("email", user.getEmail())
                    .claim("role", user.getRole())
                    .issueTime(Date.from(now))
                    .expirationTime(Date.from(now.plusSeconds(TOKEN_TTL_SECONDS)))
                    .jwtID(UUID.randomUUID().toString())
                    .build();

            SignedJWT signedJWT = new SignedJWT(
                    new JWSHeader.Builder(JWSAlgorithm.RS256)
                            .keyID("auth-service-rsa")
                            .type(com.nimbusds.jose.JOSEObjectType.JWT)
                            .build(),
                    claims
            );

            signedJWT.sign(new RSASSASigner(privateKey));
            return signedJWT.serialize();
        } catch (JOSEException ex) {
            throw new IllegalStateException("No se pudo firmar el token JWT", ex);
        }
    }

    public boolean validateToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            boolean validSignature = signedJWT.verify(new RSASSAVerifier((RSAPublicKey) publicKey));
            Date expiration = signedJWT.getJWTClaimsSet().getExpirationTime();
            return validSignature && expiration != null && expiration.after(new Date());
        } catch (ParseException | JOSEException ex) {
            return false;
        }
    }

    public String getPublicKeyPem() {
        return publicKeyPem;
    }

    private String readResource(Resource resource) throws IOException {
        return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    }

    private PrivateKey parsePrivateKey(String pem) throws Exception {
        byte[] keyBytes = decodePem(pem, "PRIVATE KEY");
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyBytes);
        return KeyFactory.getInstance("RSA").generatePrivate(keySpec);
    }

    private PublicKey parsePublicKey(String pem) throws Exception {
        byte[] keyBytes = decodePem(pem, "PUBLIC KEY");
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);
        return KeyFactory.getInstance("RSA").generatePublic(keySpec);
    }

    private byte[] decodePem(String pem, String label) {
        String normalized = pem
                .replace("-----BEGIN " + label + "-----", "")
                .replace("-----END " + label + "-----", "")
                .replaceAll("\\s", "");
        return Base64.getDecoder().decode(normalized);
    }
}
