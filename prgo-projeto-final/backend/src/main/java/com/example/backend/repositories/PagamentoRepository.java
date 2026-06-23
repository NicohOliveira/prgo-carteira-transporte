package com.example.backend.repositories;

import com.example.backend.entities.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
    List<Pagamento> findByUsuarioIdOrderByDataHoraDesc(Long usuarioId);
}